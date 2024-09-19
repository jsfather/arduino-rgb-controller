#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ArduinoJson.h>
#include "arduino_secrets.h"

const char* ssid = SECRET_SSID;
const char* password = SECRET_PASSWORD;

ESP8266WebServer server(80);

const int ledPin = LED_BUILTIN;

void builtInLedStatus() {
  int ledState = digitalRead(LED_BUILTIN);

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");

  if (ledState == HIGH) {
    server.send(200, "application/json", "{\"led\":\"off\"}");
  } else {
    server.send(200, "application/json", "{\"led\":\"on\"}");
  }
}

void builtInLedController() {
  StaticJsonDocument<200> jsonDoc;

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");

  if (server.hasArg("plain")) {
    String jsonData = server.arg("plain");
    DeserializationError error = deserializeJson(jsonDoc, jsonData);

    if (error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.f_str());
      server.send(400, "application/json", "{\"error\":\"Invalid JSON\"}");
      return;
    }

    const char* ledState = jsonDoc["led"];

    if (strcmp(ledState, "on") == 0) {
      digitalWrite(ledPin, LOW);
      server.send(200, "application/json", "{\"led\":\"on\"}");
    } else if (strcmp(ledState, "off") == 0) {
      digitalWrite(ledPin, HIGH);
      server.send(200, "application/json", "{\"led\":\"off\"}");
    } else {
      server.send(400, "application/json", "{\"error\":\"Invalid LED command\"}");
    }
  } else {
    server.send(400, "application/json", "{\"error\":\"No data received\"}");
  }
}

void setup() {
  Serial.begin(115200);

  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, HIGH);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to WiFi");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  server.on("/built-in-led/get", builtInLedStatus);
  server.on("/built-in-led/set", HTTP_POST, builtInLedController);

  server.begin();
  Serial.println("Server started");
}

void loop() {
  server.handleClient();
}