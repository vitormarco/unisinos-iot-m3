"use client";

import { useEffect, useState } from "react";
import * as mqtt from "mqtt";

const clientId = "mqttjs_" + Math.random().toString(16).substr(2, 8);
const HOST = "wss://broker.emqx.io:8084/mqtt";

export const Infos = () => {
  const [client, setClient] = useState<mqtt.MqttClient>();
  const [info, setInfo] = useState<{ temp?: string; humidity?: string }>({});

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
        mqttClient.subscribe("topic_on_off_led");
        mqttClient.subscribe("topic_sensor_temperature");
        mqttClient.subscribe("topic_sensor_humidity");
      });

      mqttClient.on("message", (topic, message) => {
        if (topic === "topic_sensor_temperature") {
          setInfo((oldState) => ({ ...oldState, temp: message.toString() }));
        }
        if (topic === "topic_sensor_humidity") {
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

  const handleTurnOnOffLed = (onOff = "1") => {
    client?.publish("topic_on_off_led", onOff);
  };

  return (
    <>
      <section className="w-full max-w-md mx-auto bg-gray-50 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Controle do LED</h2>
        <div className="flex gap-2">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
            onClick={() => handleTurnOnOffLed()}
          >
            Ligar
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
            onClick={() => handleTurnOnOffLed("0")}
          >
            Desligar
          </button>
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
