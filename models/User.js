class User {
	constructor(name, age, weight, height, profileImageURI, workouts = []) {
		this.name = name;
		this.age = age;
		this.weight = weight;
		this.height = height;
        this.profileImageURI = profileImageURI;
		this.workouts = workouts;
	}
}

export default User;