#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ArduinoJson.h>
#include "arduino_secrets.h"
#include "config.h"

const char *ssid = SECRET_SSID;
const char *password = SECRET_PASSWORD;

ESP8266WebServer server(80);

struct LEDState {
  int led;
  String color;
};

const int redPin = D2;
const int greenPin = D3;
const int bluePin = D4;
const int builtInLedPin = LED_BUILTIN;

LEDState ledState = { 1, "#00FF00" };

void hexToRGB(const String &hex, int &r, int &g, int &b) {
  long number = strtol(hex.c_str() + 1, NULL, 16);
  r = (number >> 16) & 0xFF;
  g = (number >> 8) & 0xFF;
  b = number & 0xFF;
}

void handlePost() {
  if (server.hasArg("plain")) {
    String body = server.arg("plain");
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, body);
    ledState.led = doc["led"];
    ledState.color = doc["color"].as<String>();

    if (ledState.led == 0) {
      digitalWrite(builtInLedPin, HIGH);
      analogWrite(redPin, 0);
      analogWrite(greenPin, 0);
      analogWrite(bluePin, 0);
    } else {
      int r, g, b;
      hexToRGB(ledState.color, r, g, b);
      digitalWrite(builtInLedPin, LOW);
      analogWrite(redPin, r);
      analogWrite(greenPin, g);
      analogWrite(bluePin, b);
    }

    server.send(200, "application/json", body);
  } else {
    server.send(400, "application/json", "{\"status\":\"error\"}");
  }
}


void handleGet() {
  DynamicJsonDocument doc(1024);
  doc["led"] = ledState.led;
  doc["color"] = ledState.color;
  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

void setup() {
  Serial.begin(115200);

  if (!WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS)) {
    Serial.println("STA Failed to configure");
  }

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);

  server.on("/set", HTTP_POST, handlePost);
  server.on("/get", HTTP_GET, handleGet);

  server.begin();
  Serial.println("Server started");
  int r, g, b;
  hexToRGB(ledState.color, r, g, b);
  digitalWrite(builtInLedPin, LOW);
  analogWrite(redPin, r);
  analogWrite(greenPin, g);
  analogWrite(bluePin, b);
}

void loop() {
  server.handleClient();
}
