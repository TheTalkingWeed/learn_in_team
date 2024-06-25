export default interface IAnswer {
  id: number;
  text: string;
  question_id: number;
  answered_user_id: number;
  answered_date: Date;
  approved: boolean;
  up_voted_by: Array<string>;
  down_voted_by: Array<string>;
}
