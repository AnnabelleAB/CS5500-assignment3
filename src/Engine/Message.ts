/**
 * Message class
 * @class Message
 * @classdesc Message class
 * @export Message
 * @module src/Engine/Message
 * 
 * 
 */

export class Message {
  // private members


    private _username: string;
    
    private _content: string;

    private _timestamp: Date;



  /**
   * constructor
   * @constructor

   * 
   * @returns {void}
   * 
   * */
  constructor(username:string, content:string, timestamp: string) {
      this._username = username;
      this._content = content;
      this._timestamp = new Date(timestamp);
  }
    
    public get username(): string {
        return this._username;
    }

    public get content(): string {
        return this._content;
    }

}

export default Message;