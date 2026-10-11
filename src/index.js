import jsPDF from "jspdf";
import QRCode from "qrcode";
import "./fonts/volia-normal";
import "./fonts/voliabd-normal";
import "./fonts/e-ukraine-normal";
import "./fonts/e-ukrainebd-normal";
// import "./fonts/uafsans-normal";
// import "./fonts/uafsans500-normal";
import "./fonts/uafsans600-normal";
// import "./fonts/uafsansbd-normal";
// import stamp from "./js/stamp";
import logoZSU from "./js/logoZSU";
import logoZSUdrk from "./js/logoZSUdrk";
import logoZSUinv from "./js/logoZSUinv";
import "./css/style.scss";
// import { cipher, decipher } from "./js/crypt";
import { Tea } from "./js/crypt2";
const firstNameField = document.querySelector("#firstName");
const secondNameField = document.querySelector("#secondName");
const lastNameField = document.querySelector("#lastName");
const birthDateField = document.querySelector("#birthDate");
const theTitleField = document.querySelector("#theTitle");
const courseAutorField = document.querySelector("#courseAutor");
const courseLengthField = document.querySelector("#courseLength");

const inputFieldArr = [firstNameField, secondNameField, lastNameField, birthDateField, theTitleField, courseAutorField, courseLengthField];
inputFieldArr.forEach((field) => {
	field.oninput = async (e) => {
		let clientForm = await readClientForm();
		localStorage.setItem("client", JSON.stringify(clientForm));
	};
});
// const genderCheckbox = document.querySelector("#gender");
const dropD = document.querySelector("#dd");
const logo = document.querySelector("#logo");
// const stampIMG = new Image();
// stampIMG.src = stamp;
// stampIMG.onload = (e) => {
// 	// 897px x 377px
// };
const logoZSUIMG = new Image();
logoZSUIMG.src = logoZSU;
logoZSUIMG.onload = (e) => {
	// 897px x 377px
};
const logoZSUdrkIMG = new Image();
logoZSUdrkIMG.src = logoZSUdrk;
logoZSUdrkIMG.onload = (e) => {
	// 897px x 377px
};
const logoZSUinvIMG = new Image();
logoZSUinvIMG.src = logoZSUinv;
logoZSUinvIMG.onload = (e) => {
	// 897px x 377px
};

// QRCode.toString('http://www.google.com', function (err, string) {
//     if (err) throw err
//     console.log(string)
// })
document.addEventListener("DOMContentLoaded", ready);
async function ready() {
	const hsh = window.location.hash;
	if (hsh) {
		if (hsh != "#set") {
			// const myDecipher = decipher('psw');
			let y = hsh.split("#")[1];
			try {
				// let clientObj = JSON.parse(decodeURIComponent(myDecipher(y)))
				// let clientObj = Tea.decrypt(y,"psw")

				let clientObj = JSON.parse(decodeURIComponent(Tea.decrypt(y, "psw")));

				let qr = await rndrQR(clientObj);
				console.log(clientObj, qr);
				rndrPDF(clientObj, qr, false).then((e) => {
					window.location.hash = "";
					console.log(e);
				});

				// window.location.reload();
				// logout();
			} catch (e) {
				logout();
			}
		} else {
			document.querySelector(".setupLayer").classList.add("active");
			readLocalStorage().then((e) => {});
		}
	} else {
		logout();
	}
}

function logout() {
	window.location.replace("https://synevo.ua/ua/");
}

function readLocalStorage() {
	return new Promise((resolve, reject) => {
		let localData = localStorage.getItem("client");
		if (localData) {
			let cli = JSON.parse(decodeURIComponent(localData));
			console.log(cli);
			firstNameField.value = cli.firstName;
			secondNameField.value = cli.secondName;
			lastNameField.value = cli.lastName;
			theTitleField.value = cli.theTitle;
			// console.log(cli.birthDate)
			let birthDate = [];
			let bDate = [];
			birthDate = cli.birthDate;
			birthDate = birthDate.reverse();
			// console.log(birthDate)

			birthDate.forEach((value, index, array) => {
				// console.log(value, index)
				if (index < 2) {
					bDate += add0(value) + "-";
				} else {
					bDate += add0(value);
				}
			});
			// console.log(cli.birthDate, bDate)
			birthDateField.value = bDate;
			courseAutorField.value = cli.courseAutor;
			courseLengthField.value = cli.courseLength;
			//
			// if (cli.Gender == "Male") {
			// 	genderCheckbox.checked = false;
			// 	document.querySelector("body > div > label").innerText = "Male";
			// } else {
			// 	genderCheckbox.checked = true;
			// 	document.querySelector("body > div > label").innerText = "Female";
			// }

			resolve(cli);
		} else {
			reject();
		}
	});
}
dropD.onclick = (e) => {
	// console.log(e.target)
	if (dropD.classList.contains("active")) {
		dropD.classList.remove("active");
	} else {
		dropD.classList.add("active");
	}
};
logo.onclick = logout;
document.querySelector("#printPdf").onclick = seveToPDF;
// genderCheckbox.onclick = (e) => {
// 	console.log(e.target.checked);
// 	genderCheckbox.checked ? (genderCheckbox.labels[0].innerText = "Female") : (genderCheckbox.labels[0].innerText = "Male");
// };
async function seveToPDF() {
	let clientForm = await readClientForm();
	localStorage.setItem("client", JSON.stringify(clientForm));
	let qr = await rndrQR(clientForm);
	rndrPDF(clientForm, qr, true);
}

function readClientForm() {
	return new Promise((resolve, reject) => {
		const clientObj = {};
		clientObj.firstName = firstNameField.value;
		clientObj.secondName = secondNameField.value;
		clientObj.lastName = lastNameField.value;
		clientObj.theTitle = theTitleField.value;
		let birthDate = birthDateField.value;
		let birthArray = birthDate.split("-").reverse();
		clientObj.birthDate = [];
		birthArray.forEach((value, index, array) => {
			// console.log(value)
			clientObj.birthDate.push(Number(value));
		});
		clientObj.courseLength = courseLengthField.value;
		clientObj.courseAutor != "" ? (clientObj.courseAutor = courseAutorField.value) : (clientObj.courseAutor = "");
		// genderCheckbox.checked ? (clientObj.Gender = "Female") : (clientObj.Gender = "Male");
		clientObj.rndm = Math.floor(Math.random() * 9);
		resolve(clientObj);
	});
}

function add0(x) {
	if ([...JSON.stringify(x)].length < 2) {
		return "0" + x;
	} else {
		return x;
	}
}

function getCurrentDate() {
	const now = new Date();
	now.day = now.getDate();
	now.month = now.getMonth() + 1;
	now.year = now.getFullYear();
	return now;
}

function rndrQR(client) {
	return new Promise((resolve, reject) => {
		// const myCipher = cipher('psw')
		// let x = myCipher(encodeURIComponent(JSON.stringify(client)));
		let x = Tea.encrypt(encodeURIComponent(JSON.stringify(client)), "psw");
		console.log(x, x.length);
		const CNVS = document.createElement("canvas");
		QRCode.toCanvas(CNVS, window.location.origin + "/#" + x, {
			width: 512,
			height: 512,
			colorDark: "#000000",
			colorLight: "#ffffff",
			errorCorrectionLevel: "L",
		});
		resolve(CNVS);
	});
}

function rndrPDF(client, qrCode, ovner) {
	return new Promise((resolve, reject) => {
		console.log("client - ", client);
		let birthDate = add0(Number(client.birthDate[0])) + "." + add0(Number(client.birthDate[1])) + "." + add0(Number(client.birthDate[2]));
		let birthMonth = Number(client.birthDate[1]);
		let birthYear = Number(client.birthDate[2]);
		// let clientBirthDate = add0(client.BirthDay) + '.' + add0(client.BirthMonth) + '.' + add0(client.BirthYear);
		let now = getCurrentDate();
		let clientAgeINMonth = now.year * 12 + now.month - (birthYear * 12 + birthMonth);
		let clientAge = Math.floor(clientAgeINMonth / 12) + " Y " + (clientAgeINMonth % 12) + " M";
		let orderNo = add0((client.rndm * 135) % 999);
		let barCode = add0((client.rndm * 127) % 999);
		let orderDate, resultDate;

		// if (now.day > 3) {
		orderDate = `${add0((now.day + 29) % 30)}/${add0(now.month)}/${now.year} 10:${add0((client.rndm * 2) % 59)}`;
		resultDate = `${add0((now.day + 29) % 30)}/${add0(now.month)}/${now.year} 18:${add0((client.rndm * 3) % 59)}`;
		// } else {
		//     orderDate = `${add0((now.day + 29) % 30)}/${add0(now.month-1)}/${now.year} 10:${add0((client.rndm * 2) % 59)}`;
		//     resultDate = `${add0((now.day + 29) % 30)}/${add0(now.month-1)}/${now.year} 18:${add0((client.rndm * 3) % 59)}`;
		// }

		const doc = new jsPDF("p", "pt", "a4", true);
		////////////HEADER////////////////
		doc.setFillColor(241, 239, 230);
		doc.roundedRect(21, 21, 554, 800, 15, 15, "F");

		doc.setLineWidth(1.5);
		doc.setDrawColor(195, 194, 182);
		doc.roundedRect(38, 38, 554 - 34, 800 - 34, 6, 6, "S");

		doc.addImage(logoZSUIMG, 86, 78, 354 / 3.3, 420 / 3.3);

		// doc.addFileToVFS("vb64.ttf", vb64);
		// doc.addFont("vb64.ttf", "vb64", "normal");
		// doc.setFont("vb64", "normal");

		doc.setFont("volia", "normal");
		doc.setFontSize(51);
		doc.setTextColor(44, 43, 38);
		doc.text("Сертифікат", 86, 288, { charSpace: "0.1" });

		doc.setFontSize(12);
		doc.setFont("e-ukraine", "normal");
		doc.setTextColor(90, 89, 82);
		doc.text("Виданий " + birthDate, 86, 323, null, null, "left");
		doc.text("Ідентифікатор " + crypto.randomUUID(), 86, 347, null, null, "left");

		doc.setLineWidth(0.5);
		doc.line(86, 375, 510, 375);

		doc.setFontSize(22);
		doc.setFont("voliabd", "normal");
		doc.setTextColor(44, 43, 38);
		doc.text(client.lastName + " " + client.firstName + " " + client.secondName, 86, 420, null, null, "left");

		doc.setFontSize(12);
		doc.setFont("e-ukraine", "normal");
		doc.setTextColor(90, 89, 82);
		doc.text("успішно закінчив(ла) курс", 86, 445, null, null, "left");

		doc.setFontSize(16.5);
		doc.setFont("e-ukrainebd", "normal");
		doc.setTextColor(44, 43, 38);
		// doc.text(client.theTitle, 86, 486, null, null, "left");
		// doc.text("Im line number1\r\nAnd Im line number2", 86, 486, null, null, "left");
		let theTitle = client.theTitle;
		let theTitleArr = theTitle.split(" ");
		let theTitleLength = 0;
		let theTitleTxt1 = "";
		let theTitleTxt2 = "";
		for (let i = 0; i < theTitleArr.length; i++) {
			theTitleLength = theTitleLength + theTitleArr[i].length;
			// console.log(theTitleLength);
			if (theTitleLength < 38) {
				theTitleTxt1 = theTitleTxt1 + theTitleArr[i] + " ";
			} else {
				theTitleTxt2 = theTitleTxt2 + theTitleArr[i] + " ";
			}
			// theTitleTxt = theTitleTxt + theTitleArr[i] + " ";
			// console.log(theTitleTxt1);
		}
		if (theTitleTxt2.length == 0) {
			doc.text(theTitleTxt1, 86, 487, null, null, "left");
		} else {
			doc.text(theTitleTxt1, 86, 487, null, null, "left");
			doc.text(theTitleTxt2, 86, 508, null, null, "left");
		}

		// var splitFooter = doc.splitTextToSize(client.theTitle, 450, 200, 200); // used to wrap the description content
		// doc.text(splitFooter, 86, 486);
		let descOffset = 0;
		if (theTitleTxt2.length > 0) {
			descOffset = 20;
		}
		doc.setFontSize(12);
		doc.setFont("e-ukraine", "normal");
		doc.setTextColor(90, 89, 82);
		let autorTxt = client.courseAutor;
		let autorTxtArr = autorTxt.split(" ");
		let autorTxtLength = 0;
		let autorTxt1 = "";
		let autorTxt2 = "";
		if (autorTxt.length > 0) {
			for (let i = 0; i < autorTxtArr.length; i++) {
				autorTxtLength = autorTxtLength + autorTxtArr[i].length;
				if (autorTxtLength < 45) {
					autorTxt1 = autorTxt1 + autorTxtArr[i] + " ";
				} else {
					autorTxt2 = autorTxt2 + autorTxtArr[i] + " ";
				}
			}
			if (autorTxt2.length == 0) {
				doc.text(`Автор: ${autorTxt1}`, 86, 510 + descOffset, null, null, "left");
			} else {
				doc.text(`Автор: ${autorTxt1}`, 86, 510 + descOffset, null, null, "left");
				doc.text(autorTxt2, 86, 525 + descOffset, null, null, "left");
				descOffset = descOffset + 15;
			}
		}
		// doc.text(`Автор: ${client.courseAutor}`, 86, 510 + descOffset, null, null, "left");

		doc.setLineWidth(0.5);
		doc.line(86, 537 + descOffset, 510, 537 + descOffset);

		doc.setFontSize(12);
		doc.setFont("e-ukraine", "normal");
		doc.setTextColor(90, 89, 82);
		doc.text(
			`Загальне навантаження ${Number(client.courseLength.split(":")[0])} год ${Number(client.courseLength.split(":")[1])} хв  •  Складено іспит`,
			86,
			572 + descOffset,
			null,
			null,
			"left"
		);

		/////////FOOTER////////////////
		doc.setLineWidth(0.5);
		doc.line(86, 692, 510, 692);

		doc.addImage(logoZSUdrkIMG, 86, 718, 354 / 19, 420 / 19);

		doc.setFontSize(12);
		doc.setFont("e-ukrainebd", "normal");
		doc.setTextColor(90, 89, 82);
		doc.text("Міністерство", 116, 726, null, null, "left");
		doc.text("оборони України", 116, 742, null, null, "left");

		doc.addImage(logoZSUinvIMG, 288, 714, 354 / 22, 420 / 22);

		doc.setFontSize(14);
		doc.setFont("uafsans600", "normal");
		doc.setTextColor(90, 89, 82);
		doc.text("Генеральний штаб", 312, 728, null, null, "left");
		doc.text("Збройних Сил", 312, 744, null, null, "left");
		doc.text("України", 312, 760, null, null, "left");

		const properties = {
			title: "Сертифікат",
			keywords: "generation=" + crypto.randomUUID(),
			producer: "Армія+",
			creator: "Армія+",
		};

		doc.setProperties(properties);
		// doc.text("Laboratory Kyiv", 560, 60, null, null, "right");
		// doc.setFontSize(9);
		// doc.setFont("volia");
		// doc.text("46/2 Akademika Palladina Ave", 560, 71, null, null, "right");
		// doc.text("Accreditation DSTU EN ISO 15189:2015", 560, 83, null, null, "right");
		// doc.setFont("voliabd");
		// doc.setFontSize(12);
		// let title = "Examination results";
		// doc.text(title, 298, 76, null, null, "center");

		// ///////////////////////////////////////////////////
		// /////////////////TITLE/////////////////////////////
		// doc.setFontSize(10);
		// doc.setFont("volia");
		// doc.text("Order Date:", 60, 106);
		// doc.text("Result Date:", 60, 120);
		// doc.text("Patient:", 60, 134);
		// doc.text("Date of birth:", 60, 148);
		// doc.text("Age:", 60, 162);
		// doc.text("Gender:", 60, 176);
		// ////////////////////////////////////////////////////
		// doc.text(orderDate, 150, 106);
		// doc.text(resultDate, 150, 120);
		// doc.setFontSize(11);
		// doc.setFont("voliabd");
		// doc.text(client.lastName + " " + client.firstName + " " + client.secondName, 150, 134);
		// doc.setFontSize(10);
		// doc.setFont("volia");
		// doc.text(birthDate, 150, 148);
		// doc.text(clientAge, 150, 162);
		// doc.text(client.Gender, 150, 176);
		// ////////////////////////////////////////////////////////////
		// ////////////////////////////////////////////////////////////
		// doc.text("Order No:", 241, 106);
		// // doc.text(orderNo, 299, 106);
		// doc.text("260123" + orderNo, 299, 106);
		// ////////////////////////////////////////////////////////////
		// ////////////////////////////////////////////////////////////
		// doc.text("Contact:", 232, 148);
		// doc.text("BDP:", 232, 162);
		// doc.text("Doctor:", 232, 176);
		// ///////////////////////////////////////////////////////////
		// doc.text("!!FFS Київ", 285, 148);
		// doc.text("Kyiv(Peremohy 80/57)3", 285, 162);
		// doc.text("Bez Napravlennia ..", 285, 176);
		// ///////////////////////////////////////////////////////////
		// doc.text("Barcode:", 443, 144);
		// doc.rect(448, 154, 36, 12, "D");
		// doc.rect(450, 154, 32, 12, "D");
		// doc.setFontSize(7);
		// doc.text("High attention zone", 493, 156);
		// doc.setFontSize(10);
		// doc.setFont("voliabd");
		// doc.text("30048658" + barCode, 500, 144);
		// ///////////////////////////////////////////////////////////
		// ///////////////////////////////////////////////////////////
		// doc.setDrawColor(0);
		// doc.setFillColor(180);
		// doc.rect(60, 187, 500, 13, "FD");
		// doc.setFontSize(8);
		// doc.text("Parameter", 121, 196);
		// doc.text("Result", 281, 196);
		// doc.text("Unit", 356, 196);
		// doc.text("Reference range", 452, 196);
		// ///////////////////////////////////////////////////////////
		// doc.setFontSize(12);
		// doc.text("PCR", 60, 212);
		// doc.line(60, 217, 560, 217);
		// doc.setLineDash([1, 2]);
		// doc.setDrawColor(180);
		// doc.line(60, 217, 560, 217);
		// doc.setLineDash(0);
		// doc.setDrawColor(0);
		// ///////////////////////////////////////////////////////////
		// doc.setFontSize(9);
		// doc.text("PCR. Coronavirus (RNA SARS-CoV-2,", 69, 227);
		// doc.text("naso-oropharyngeal scraping, qualitative", 69, 238);
		// doc.text("determination, rRT-PCR method)", 69, 249);
		// doc.setFont("volia");
		// doc.text("Gene RdRP SARS-CoV-2", 75, 262);
		// doc.text("Gene E SARS-CoV-2", 75, 280);
		// doc.text("laboratory report:", 75, 298);
		// ///////////////////////////////////////////////////////////
		// doc.setFont("voliabd");
		// doc.text("negative", 275, 262);
		// doc.text("negative", 275, 280);
		// doc.text("negative", 275, 298);
		// ///////////////////////////////////////////////////////////
		// doc.setFontSize(8);
		// doc.setFont("volia");
		// doc.text("negative", 391, 262);
		// doc.text("negative", 391, 280);
		// doc.text("negative  RNA SARS-CoV-2", 391, 298);
		// doc.text("The analytical sensitivity of the test system", 391, 307);
		// doc.text("250 RNA copies/ml", 391, 316);
		// doc.text("Method: Real-time PCR (rRT-PCR)", 391, 325);
		// doc.text("Reagents: BAG Diagnostics (Germany), which are", 391, 334);
		// doc.text("certified by the CE system (IVD)", 391, 343);
		// doc.text("Analyzer: CFX-96 (BioRad, USA)", 391, 352);
		// doc.setLineWidth(0.2);
		// doc.setDrawColor(200);
		// doc.line(69, 268, 560, 268);
		// doc.line(69, 287, 560, 287);
		// doc.line(69, 356, 560, 356);
		// ///////////////////////////////////////////////////////////
		// doc.setDrawColor(0);
		// doc.setLineWidth(2);
		// doc.line(60, 359, 560, 359);
		// ///////////////////////////////////////////////////////////
		// doc.setFontSize(9);
		// doc.text("Remark:", 75, 370);
		// // doc.text('negative  RNA SARS-CoV-2', 391, 361)
		// doc.addImage(stampIMG, 280, 390, 897 / 3.3, 377 / 3.3);
		// doc.addImage(qrCode, 110, 575, 150, 150);
		// ///////////////////////////////////////////////////////////
		// doc.setDrawColor(0);
		// doc.setLineWidth(1);
		// doc.setFontSize(8);
		// doc.text("Laboratory test results cannot be a sole ground for diagnosis.", 63, 786);
		// doc.text("Only doctor can interpret results and make a diagnosis.", 63, 796);
		// doc.text(`Samples processing and results' issuing is performed using laboratory information system SILAB`, 63, 806);
		// doc.text(`Page 1 of 1`, 63, 821);
		// if (ovner) {
		// 	doc.textWithLink(`Print Date: ${now.month}/${now.day}/${now.year}`, 485, 821, {
		// 		url: window.location.origin + "/#set",
		// 	});
		// } else {
		// 	doc.text(`Print Date: ${now.month}/${now.day}/${now.year}`, 485, 821);
		// }
		// doc.line(63, 810, 560, 810);
		//////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////

		if (ovner) {
			let pdfName = theTitle.split(".").join("");
			pdfName = pdfName.split(" ").join("_");
			doc.save(`Сертифікат_до_курсу_${pdfName}.pdf`);
		} else {
			// window.location.href =
			// document.querySelector("#pdfLink").href = URL.createObjectURL(doc.output("blob"));
			// document.querySelector("#pdfLink").download = URL.createObjectURL(doc.output("blob"));
			document.querySelector("#pdfLink").innerText = `2601227${orderNo}-${decodeURIComponent(client.lastName)}.${decodeURIComponent(
				[...client.firstName][0]
			)}.${decodeURIComponent([...client.secondName][0])}.-${orderDate.split(" ")[0]}.pdf`;
			document.querySelector(".synevoLayer").classList.add("active");
			document.querySelector("#pdfLink").onclick = () => {
				doc.save(
					`2601227${orderNo}-${decodeURIComponent(client.lastName)}.${decodeURIComponent([...client.firstName][0])}.${decodeURIComponent(
						[...client.secondName][0]
					)}.-${orderDate.split(" ")[0]}.pdf`
				);
			};
		}

		//
		resolve();
	});
}
