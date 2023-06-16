const TimeTable = require('../Models/TimeTable');



exports.addSchedule = async (schedule) => {




    try {
/// search the doc  by class_name and day and time_slot


const filter = { class_name: schedule.class_name, day: schedule.day, time_slot: schedule.time_slot };



const existingDocInDb=await TimeTable.findOne(filter);

        if(existingDocInDb){

            // update the doc if found

            const update = { $set: { subject: schedule.subject, class_room: schedule.class_room, teacher: schedule.teacher } };

            await TimeTable.updateOne(filter, update);

            console.log('Class schedule updated successfully');
        }

else{

    // create a new doc if not found

    const newSchedule = new TimeTable(schedule);

    await newSchedule.save();

    console.log('New class schedule created successfully');
}
        


    } catch (error) {

        
throw error;

    }

}