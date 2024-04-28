export default interface IQuestion {
  id: number;
  title: string;
  text: string;
  topic_id: number;
  posted_user_id: string;
  posted_time: Date;
  up_voted_by:Array<string> ;
  down_voted_by: Array<string>;
}
