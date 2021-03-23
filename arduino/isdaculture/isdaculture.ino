#include <WiFi101.h>
#include <OneWire.h>
#include <DallasTemperature.h>

OneWire oneWire(14);

DallasTemperature sensors(&oneWire);

char ssid[] = "PISO_WIFIX2.4";
char pass[] = "jomjomjom";

int status = WL_IDLE_STATUS;
float Celsius = 0;

void setup() {
  Serial.begin(9600);
  sensors.begin();
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  // check for the presence of the shield:
  if (WiFi.status() == WL_NO_SHIELD) {
//    Serial.println("WiFi shield not present");
    // don't continue:
    while (true);
  }

  // attempt to connect to WiFi network:
  while (status != WL_CONNECTED) {
//    Serial.print("Attempting to connect to SSID: ");
//    Serial.println(ssid);
    // Connect to WPA/WPA2 network. Change this line if using open or WEP network:
    status = WiFi.begin(ssid, pass);

    // wait 10 seconds for connection:
    delay(1000);
  }
//  printWiFiStatus();
}

void loop() {
  sensors.requestTemperatures();

  Celsius = sensors.getTempCByIndex(0);

  Serial.println(Celsius);

//  if (Celsius > 32 ) {
//    Serial.println("Temp is high");
//  }
//
//  if (Celsius < 20 ) {
//    Serial.println("Temp is low");
//  }

  delay(1000);
}

void printWiFiStatus() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your WiFi shield's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
}
