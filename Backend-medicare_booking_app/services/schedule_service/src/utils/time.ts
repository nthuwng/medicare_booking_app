import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";
dayjs.extend(utc); dayjs.extend(tz);

export const nowVN = () => dayjs().tz("Asia/Ho_Chi_Minh");
export const todayVN = () => nowVN().startOf("day");
export const todayStr = () => todayVN().format("YYYY-MM-DD");
export const nowTimeStr = () => nowVN().format("HH:mm:ss");