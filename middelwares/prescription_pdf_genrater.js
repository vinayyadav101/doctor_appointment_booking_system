import PDFDocument  from 'pdfkit';
import fs  from'fs'
import path from 'path';
import logging from '../config/logfileConfig.js';


const doc = new PDFDocument();



function updateEmptyFields(obj) {
  for (let key in obj) {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      
      updateEmptyFields(obj[key]);

    } else if (Array.isArray(obj[key])) {
     
      obj[key].forEach(item => updateEmptyFields(item));

    } else if (obj[key] === "") {
   
      obj[key] = "Not Mention";

    }
  }
}


const createPrescription = async(req,res , next) => {

  const { genralDetails , gernralTestResults , medicineDetails , ComanText , prescriberDetails , appointmentID} = req.body

  

  if (!genralDetails || !gernralTestResults || !medicineDetails || !prescriberDetails) {
    logging.info("please provide all details for prescription")
}

    updateEmptyFields({
      genralDetails,
      gernralTestResults,
      medicineDetails,
      ComanText,
      prescriberDetails
    })
const filePath = `./upload/${genralDetails.patientName}_${genralDetails.Date}_prescription.pdf`

    try {

      
          doc.pipe(fs.createWriteStream(filePath));


          doc.font('Helvetica').fontSize(10);


          doc
            .fontSize(18)
            .text(prescriberDetails.doctorName, 50, 50)
            .fontSize(14)
            .text("Medical Prescription", 50, 70);

          doc
            .fontSize(16)
            .text(prescriberDetails.hospitalName, 300, 50, { align: 'right' });

          
          doc
            .fontSize(10)
            .rect(50, 100, 500, 100).stroke() // Outer box
            .text(`Patient Name: ${genralDetails.patientName}`, 55, 105)
            .text(`Date: ${genralDetails.Date}`, 350, 105)
            .text("S/O | D/O | W/O:", 55, 125)
            .text(`Age: ${genralDetails.Age}`, 350, 125)
            .text(`Sex: ${genralDetails.Sex}`, 400, 125)
            .text(`Health Insurance No.: ${genralDetails.HealthInsuranceNoovide}`, 55, 165)
            .text(`Health Care Provider: ${genralDetails.HealthCareProviderrovide}`, 250, 165)
            .text(`Health Card No.: ${genralDetails.HealthCardNo}`, 55, 185)
            .text(`Patient ID No.: ${genralDetails.PatientIDNo}`, 250, 185);

          // Patient Address Section
          doc
            .rect(50, 210, 500, 20).stroke() 
            .text(`Patient's Address: ${genralDetails.patientAddress}`, 55, 215);

          // Diagnosis Section
          doc
            .rect(50, 240, 350, 20).stroke() 
            .text(`Diagnosed With: ${gernralTestResults.Dignosed}`, 55, 245)
            .rect(400, 240, 150, 20).stroke() 
            .text(`Cell No: ${gernralTestResults.CellNO}`, 405, 245);

          // Vitals Section
          doc
            .rect(50, 270, 150, 20).stroke()
            .text(`Blood Pressure: ${gernralTestResults.BllodPressure}`, 55, 275)
            .rect(210, 270, 150, 20).stroke() 
            .text(`Pulse Rate: ${gernralTestResults.PulseRate}`, 215, 275)
            .rect(370, 270, 150, 20).stroke() 
            .text(`Weight: ${gernralTestResults.Wegight}`, 375, 275)


          doc
            .font('Helvetica-Bold')
            .rect(50, 300, 35, 20).stroke()
            .text('NO' , 60 , 305)
            .rect(85, 300, 150, 20).stroke()
            .text('Drugs' , 130 , 305)
            .rect(235, 300, 150, 20).stroke()
            .text('unit(Tablet / syrup' , 265 , 305)
            .rect(385, 300, 165, 20).stroke()
            .text('Dosage(Per Day)' , 430 , 305)
            .moveDown(0.3)


          medicineDetails.forEach((value , index) => {
              const startY = 320
          
              doc
                  .font('Helvetica')
                  .rect(50, startY + index * 20, 35, 20).stroke()
                  .text(index + 1 ,60 , (startY + index * 20)+5)
                  .rect(85, startY + index * 20, 150, 20).stroke()
                  .text(value.drugName , 95 , (startY + index * 20) + 5)
                  .rect(235, startY + index * 20, 150, 20).stroke()
                  .text(value.Units , 310 , (startY + index * 20) + 5)
                  .rect(385, startY + index * 20, 165, 20).stroke()
                  .text(value.dosages , 465 , (startY + index * 20) + 5 )        
                  .moveDown(0.3)
          
          })


          doc
              .rect(50, doc.y + 5, 500, 40).stroke()
              .font('Helvetica-Bold')
              .text("Diet To Follow:", 55, doc.y + 10 , {continued:true})

          doc
            .font('Helvetica')
            .text(ComanText.dietFollow)
            .moveDown(2);

          // History Section
          doc
            .rect(50, doc.y + 5, 500, 40).stroke() 
            .font('Helvetica-Bold')
            .text("Brief History of Patient: ", 55, doc.y + 10 , {continued:true})

          doc
            .font('Helvetica')
            .text(ComanText.briefHistory)
            .moveDown(2);



          // Signature Section
          doc
            .rect(300, doc.y + 5, 250, 20).stroke() // Box for Signature
            .text(`Doctor name:${prescriberDetails.doctorName}`, 305, doc.y + 10);

          // Finalize the PDF and end the stream
          doc.end();
      

    } catch (error) {
        console.log(error);
        
    }


    req.file = path.resolve(filePath)    
    req.id = appointmentID

next()
}



export default createPrescription;