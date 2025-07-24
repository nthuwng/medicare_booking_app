// import { getIO } from "../../socket";
// import { getChannel } from "../connection";

// // Khởi tạo consumer để lắng nghe exchange "doctor.exchange"
// export const initNotificationRegisterDoctorConsumer = async () => {
//   const channel = getChannel();

//   const exchangeName = "doctor.exchange";
//   const queueName = "websocket.doctor.registered";

//   // Tạo exchange
//   await channel.assertExchange(exchangeName, "fanout", { durable: false });

//   // Tạo queue riêng cho websocket service
//   await channel.assertQueue(queueName, { durable: false });

//   // Bind queue vào exchange
//   await channel.bindQueue(queueName, exchangeName, "");

//   console.log(
//     `[Websocket Consumer] Waiting for messages in queue: ${queueName}`
//   );

//   channel.consume(queueName, async (msg) => {
//     if (!msg) return;

//     try {
//       const { userId, doctorId, fullName, phone } = JSON.parse(
//         msg.content.toString()
//       );

//       const io = getIO();
//       io.to("admins").emit("doctorRegistration", {
//         userId,
//         doctorId,
//         fullName,
//         phone,
//       });

//       console.log(
//         `[Websocket Consumer] Successfully broadcasted doctor registration for ${fullName}`
//       );

//       channel.ack(msg);
//     } catch (err) {
//       console.error(
//         "Error processing doctor registration in websocket service:",
//         err
//       );
//       channel.nack(msg, false, false); // bỏ qua message lỗi
//     }
//   });
// };
