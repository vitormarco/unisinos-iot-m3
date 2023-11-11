"use client";

import { useEffect, useState } from "react";
import * as mqtt from "mqtt";
import Toggle from "./Toggle";

const clientId = "mqttjs_" + Math.random().toString(16).substr(2, 8);
const HOST = "wss://broker.emqx.io:8084/mqtt";
const LED = {
  off: "0",
  on: "1",
};

const topics = {
  topic_on_off_led: "vam_topic_on_off_led",
  topic_sensor_temperature: "vam_topic_sensor_temperature",
  topic_sensor_humidity: "vam_topic_sensor_humidity",
};

export const Infos = () => {
  const [client, setClient] = useState<mqtt.MqttClient>();
  const [info, setInfo] = useState<{
    temp?: string;
    humidity?: string;
    ledOn: string;
  }>({ ledOn: "0" });

  useEffect(() => {
    const setupMqttClient = () => {
      const mqttClient = mqtt.connect(HOST, {
        clientId,
        username: "Wokwi-GUEST",
        password: "",
        protocolId: "MQTT",
      });

      mqttClient.on("connect", () => {
        console.log("Conectado ao broker MQTT local");
        mqttClient.subscribe(topics.topic_on_off_led);
        mqttClient.subscribe(topics.topic_sensor_temperature);
        mqttClient.subscribe(topics.topic_sensor_humidity);
      });

      mqttClient.on("message", (topic, message) => {
        if (topic === topics.topic_sensor_temperature) {
          setInfo((oldState) => ({ ...oldState, temp: message.toString() }));
        }
        if (topic === topics.topic_sensor_humidity) {
          setInfo((oldState) => ({
            ...oldState,
            humidity: message.toString(),
          }));
        }
        console.log(
          `Mensagem recebida no tópico '${topic}': ${message.toString()}`
        );
      });
      setClient(mqttClient);
    };

    setupMqttClient();
  }, []);

  const handleTurnOnOffLed = (onOff = LED.on) => {
    client?.publish(topics.topic_on_off_led, onOff);
  };

  return (
    <>
      <section className="w-full max-w-md mx-auto bg-gray-50 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Controle do LED</h2>
        <div className="flex gap-2">
          <Toggle
            name="ledOnOff"
            isChecked={info.ledOn === LED.on}
            onChange={() => {
              const ledState = info.ledOn === LED.on ? LED.off : LED.on;

              setInfo((oldState) => ({
                ...oldState,
                ledOn: ledState,
              }));
              handleTurnOnOffLed(ledState);
            }}
          />
        </div>
      </section>
      <section className="w-full max-w-md mx-auto bg-gray-50 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Temperatura:</h2>
        <p>{info.temp ?? "Aguardando info..."}</p>
      </section>
      <section className="w-full max-w-md mx-auto bg-gray-50 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Umidade</h2>
        <p>{info.humidity ?? "Aguardando info..."}</p>
      </section>
    </>
  );
};
