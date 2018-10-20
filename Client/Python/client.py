import paho.mqtt.client as mqtt
import time

def on_connect(mqttc, obj, flags, rc):
    print("rc: " + str(rc))


def on_message(mqttc, obj, msg):
    print("preparando msg")
    prepareMessages(mqttc, msg)

def prepareMessages(mqttc, msg):
    # publish(topic, payload, qos)
    if msg.topic == "teste":
        print("topico teste, esperando 5 seg")
        time.sleep(5)
        print("mandando msg..")
        mqttc.publish("foo", "bar", qos=0)
    else:
        print("topico teste, esperando 2 seg")
        time.sleep(2)
        print("mandando msg..")
        mqttc.publish("bar", "foo", qos=0)

def on_publish(mqttc, obj, mid):
    print("mid: " + str(mid))


def on_subscribe(mqttc, obj, mid, granted_qos):
    print("Subscribed: " + str(mid) + " " + str(granted_qos))


def on_log(mqttc, obj, level, string):
    print(string)


# If you want to use a specific client id, use
# mqttc = mqtt.Client("client-id")
# but note that the client id must be unique on the broker. Leaving the client
# id parameter empty will generate a random id for you.
mqttc = mqtt.Client("teste-id")
mqttc.on_message = on_message
mqttc.on_connect = on_connect
mqttc.on_publish = on_publish
mqttc.on_subscribe = on_subscribe
# Uncomment to enable debug messages
# mqttc.on_log = on_log
mqttc.connect("localhost", 1883, 60)
mqttc.subscribe("teste", 0)

mqttc.loop_forever()