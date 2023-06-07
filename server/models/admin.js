class Admin {

  constructor(data, uid) {
    this.admin_id = uid;
    if (data) {
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
      this.image = data.image;
      this.createdAt = data.createdAt;
    }
  }


  static fromSnapshot(snapshot, admin_id) {
    this.admin_id = admin_id;
    this.email = snapshot.email.stringValue;
    this.password = snapshot.password.stringValue;
    this.firstname = snapshot.firstname.stringValue;
    this.lastname = snapshot.lastname.stringValue;
    this.address = snapshot.address.stringValue;
    this.status = snapshot.status.booleanValue;
    this.verified = snapshot.verified.booleanValue;
    this.contact_no = snapshot.contact_no.stringValue;
    this.gender = snapshot.gender.integerValue;
    this.birthday = snapshot.birthday.timeStampValue;
    this.image = snapshot.image.stringValue;
    this.createdAt = snapshot.createdAt.timeStampValue;
  }

}

module.exports = Admin;
