import { Model, ObjectModel } from "objectmodel";
import DOMPurify from 'dompurify'; // Import DOMPurify for sanitization

function log(msg, errors) {
	console.log(msg);
	errors.forEach(error => {
		console.log(error);
	});
	document.write(
		DOMPurify.sanitize([msg, ...errors.map(e => e.message)].join("<br>→ ") + "<br><br>") // Sanitize the HTML content
	);
}

Model.prototype.errorCollector = function(errors) {
	log("Global error collector caught these errors:", errors);
};

const Student = ObjectModel({
	name: String,
	course: ["math", "english", "history"],
	grade: Number
}).assert(
	student => student.grade >= 60,
	"should at least get 60 to validate semester"
);

new Student({ name: "Joanna", course: "sleep", grade: 0 });

Student.errorCollector = function(errors) {
	log("Student model error collector caught these errors:", errors);
};

new Student({ name: "Joanna", course: "math", grade: 50 });

Student.test(
	{
		name: "Joanna",
		course: "cheating",
		grade: 90
	},
	function(errors) {
		log("This specific error collector caught these errors:", errors);
	}
);