class Verification {

    constructor(data, uid) {
      this.verification_id = uid;
      if (data) {
        this.custId = data.custId;
        this.itinId = data.itinId;
        this.id_name = data.id_name;
        this.id_number = data.id_number;
        this.id_type = data.id_type;
        this.image = data.image;
        this.status = data.status;
        this.id_expirationDate = data.id_expirationDate;
        this.message = data.message;
        this.customerDetails = {};
      }
    }
  
  
    static fromSnapshot(snapshot, verification_id) {
      this.verification_id = verification_id;
      this.custId = snapshot.custId.stringValue;
      this.itinId = snapshot.itinId.stringValue;
      this.id_name = snapshot.id_name.stringValue;
      this.id_number = snapshot.id_number.stringValue;
      this.id_type = snapshot.id_type.stringValue;
      this.status = snapshot.status.integerValue;
      this.image = snapshot.image.stringValue;
      this.id_expirationDate = snapshot.id_expirationDate.timeStampValue;
      this.message = snapshot.message.stringValue;
      this.customerDetails = {};
    }
  
  }
  
  module.exports = Verification;
  