class WithdrawalRequest {

    constructor(data, uid) {
      this.withdrawal_request_id = uid;
      if (data) {
        this.withdrawal_userid = data.withdrawal_userid;
        this.withdrawal_itinid = data.withdrawal_itinid;
        this.withdrawal_gcashnum = data.withdrawal_gcashnum;
        this.withdrawal_amount = data.withdrawal_amount;
        this.withdrawal_status = data.withdrawal_status;
        this.withdrawal_timestampSent = data.withdrawal_timestampSent;
        this.withdrawal_timestampRespond = data.withdrawal_timestampRespond;
        this.balance = {};
        this.userDetails = {};
        this.type = {};
      }
    }
  
  
    static fromSnapshot(snapshot, withdrawal_request_id) {
      this.withdrawal_request_id = withdrawal_request_id;
      this.withdrawal_userid = snapshot.withdrawal_userid.stringValue;
      this.withdrawal_itinid = snapshot.withdrawal_itinid.stringValue;
      this.withdrawal_gcashnum = snapshot.withdrawal_gcashnum.stringValue;
      this.withdrawal_amount = snapshot.withdrawal_amount.integerValue;
      this.withdrawal_status = snapshot.withdrawal_status.integerValue;
      this.withdrawal_timestampSent = snapshot.withdrawal_timestampSent.timeStampValue;
      this.withdrawal_timestampRespond = snapshot.withdrawal_timestampRespond.timeStampValue;
      this.balance = {};
      this.userDetails = {};
      this.type = {};
    }
  
  }
  
  module.exports = WithdrawalRequest;
  