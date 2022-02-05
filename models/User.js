class User {
	constructor(name, dob, weight, height, useMetric, profileImageURI) {
		this.name = name;
		this.dob = dob;
		this.weight = weight;
		this.height = height;
		this.useMetric = useMetric;
        this.profileImageURI = profileImageURI;
	}
}

export default User;