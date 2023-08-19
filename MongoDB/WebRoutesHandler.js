const TimeTable = require("../Models/TimeTable");

const getDropdownData = async (req, res) => {
    let classes = []
    let teachers = []
    let subjects = []
    let timeSlots = []
    try {
        const response = await TimeTable.find({}, { "class_name": 1, "_id": 0, "teacher": 1, "subject": 1, "time_slot": 1 }); // projection   
        if (!response) {
            return res.status(404).json({ message: "No data found" })
        }
        response.forEach((item) => {
            classes.push(item.class_name)
            teachers.push(item.teacher)
            subjects.push(item.subject)
            timeSlots.push(item.time_slot)
        })
        res.status(200).json({ classes, teachers, subjects, timeSlots })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}


const getTeacherSchedule = async (req, res) => {
    try {
        const response = await TimeTable.find({ teacher: req.params.teacherName })
        if (!response) {
            return res.status(404).json({ message: "No data found" })
        }
        res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}


const getSubjectSchedule = async (req, res) => {

    try {
const response = await TimeTable.aggregate([
    {
      $match: { subject: req.params.subjectName }
    },
    {
      $group: {
        _id: "$class_name",
        teacher: { $first: "$teacher" },
        subject: { $first: "$subject" }
      }
    },
    {
      $project: {
        _id: 0,
        class_name: "$_id",
        teacher: 1,
        subject: 1
      }
    },{
        $sort: { teacher: 1 }
    }
  ])
        if (!response) {
            return res.status(404).json({ message: "No data found" })
        }
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

const getClassSchedule = async (req, res) => {

   


    try {
        const response = await TimeTable.find({ class_name: req.params.className })
        if (!response) {
            return res.status(404).json({ message: "No data found" })
        }
        res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }

}
 


    const getClassRoomSchedule = async (req, res) => {

        console.log(req.params)



        try {
            const response = await TimeTable.find({ class_room: req.params.roomName,time_slot:req.params.timeSlot,day:req.params.day })
            if (!response) {
                return res.status(404).json({ message: "No data found" })
            }
            res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" })
        }


    }

module.exports = {
    getDropdownData,
    getTeacherSchedule,
    getSubjectSchedule,
    getClassSchedule,
    getClassRoomSchedule


}

