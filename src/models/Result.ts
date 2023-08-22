export default class Result {
  constructor(
    public _id: number,
    public course: number,
    public grade: string,
    public score: number,
    public semester: number,
    public session: number
  ) {}
}
