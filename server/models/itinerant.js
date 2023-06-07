class Itinerant {
  constructor(data, uid) {
    this.itinerant_id = uid;
    this.email = data.email;
    this.password = data.password;
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.address = data.address;
    this.status = data.status;
    this.verified = data.verified;
    this.contact_no = data.contact_no;
    this.gender = data.gender;
    this.birthday = data.birthday;
    this.createdAt = data.createdAt;
  }


  static fromSnapshot(snapshot, itinerant_id) {
    this.itinerant_id = itinerant_id;
    this.email = snapshot.email.stringValue;
    this.password = snapshot.password.stringValue;
    this.firstname = snapshot.firstname.stringValue;
    this.lastname = snapshot.lastname.stringValue;
    this.address = snapshot.address.stringValue;
    this.status = snapshot.status.booleanValue;
    this.verified = snapshot.verified.booleanValue;
    this.contact_no = snapshot.verified.stringValue;
    this.gender = snapshot.verified.integerValue;
    this.birthday = snapshot.verified.birthday.timeStampValue;
    this.createdAt = snapshot.createdAt.timeStampValue;
  }

}

module.exports = Itinerant;
