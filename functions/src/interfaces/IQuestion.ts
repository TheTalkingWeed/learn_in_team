export default interface IQuestion {
  id: number;
  title: string;
  text: string;
  topic_id: Array<number>;
  posted_user_id: number;
  posted_time: Date;
  up_voted_by: Array<number>;
  down_voted_by: Array<number>;
}
