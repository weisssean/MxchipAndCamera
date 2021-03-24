/******************************************************************************
 * Created Date: Saturday July 25th 2020                                      *
 * Author: Sean W.                                                            *
 * -----                                                                      *
 * Last Modified: Tue Mar 23 2021                                             * 
 * Modified By: Sean W.                                                       * 
 * -----                                                                      *
 * File: /src/utils/events.js                                                 *
 * Copyright (c) 2020 MultiSensor                                             *
 ******************************************************************************/

const { EventHubConsumerClient } = require("@azure/event-hubs");

let client = null;

let subscription = null;

/**
 *
 * @function subscribe:  a function for setting up updates from event hub for all device change messages
 *
 * @param {*} socket to send the results to the front end
 */
const toIoTHub = async callback => {
  console.log(
    "connecting to event hub",
    process.env.REACT_APP_EVENT_HUB_CONNECTION_STRING
  );

  const toMessage = message => {
    const payload = {
      iotData: message.body,
      messageSource: message.systemProperties["iothub-message-source"],
      messageDate: message.enqueuedTimeUtc || Date.now().toISOString(),
      deviceId: message.systemProperties["iothub-connection-device-id"]
    };
    return payload;
  };

  client = new EventHubConsumerClient(
    process.env.REACT_APP_EVENT_HUB_CONSUMER_GROUP,
    process.env.REACT_APP_EVENT_HUB_CONNECTION_STRING
  );

  // subscribe to get events
  subscription = client.subscribe({
    processEvents: async (events, context) => {
      // filter out non twin patch events
      const items = events; // .filter(true);
      if (items.length) {
        items.map(message => {
          console.log(
            "message type = ",
            message.systemProperties["iothub-message-source"]
          );

          // console.log("\n \n sending message", toMessage(message));
          callback("cam_heartbeat", toMessage(message));
          return toMessage(message);
        });

        await context.updateCheckpoint(events[events.length - 1]);
      }
    },
    processError: async (err, context) => {
      // error reporting/handling
      console.log("processError", err);
      // await disconnect();
      // subscribe(socket);
    }
  });

  // await new Promise(resolve => {
  //   setTimeout(async () => {
  //     await subscription.close();
  //     await client.close();
  //     resolve();
  //   }, 30000);
  // });
  // } catch (err) {
  //   console.error(err);

  // }
};

// TODO: change to await
const subscribe = async callback => {
  // if (process.env.REACT_APP_API_ORIGIN!=="local")
    await disconnect();
    
    await toIoTHub(callback);
  // toDeviceTwinChanges(socket);
};

/**
 *
 * @function disconnect:  a function for closing event hub connection
 *
 */
const disconnect = async () => {
  console.log("disconnecting from event hub");
  if (subscription) await subscription.close();
  if (client) await client.close();
  return true;
};

export { subscribe, disconnect };
