const teacherValidator = async (req, res, next) => {
  const teacher = req.params.teacherName;
  if (!teacher || teacher === "") {
    return res
      .status(400)
      .json({ message: "Teacher name is required for this route" });
  }
  if (teacher.length < 3) {
    return res
      .status(400)
      .json({ message: "Teacher name must be atleast 3 characters long" });
  }

  next();
};

const subjectValidator = async (req, res, next) => {
  const subject = req.params.subjectName;
  if (!subject || subject === "" || subject === " ") {
    return res
      .status(400)
      .json({ message: "Subject name is required for this route" });
  }
  if (subject.length < 3) {
    return res
      .status(400)
      .json({ message: "Subject name must be atleast 3 characters long" });
  }

  next();
};

const classValidator = async (req, res, next) => {
  const className = req.params.className;
  if (!className || className === "" || className.length < 3) {
    return res
      .status(400)
      .json({ message: "Class name is required for this route" });
  }

  next();
};

const roomValidator = async (req, res, next) => {
  const { roomName, timeSlot, day } = req.params;

  if (!roomName || roomName === "" || roomName < 3) {
    return res
      .status(400)
      .json({ message: "Room name is required for this route" });
  }

  if (!timeSlot || timeSlot === "" || timeSlot === " ") {
    return res
      .status(400)
      .json({ message: "Time slot is required for this route" });
  }

  if (!day || day === "" || day.length < 6) {
    return res.status(400).json({ message: "Day is required for this route" });
  }
  next();
};

module.exports = {
  teacherValidator,
  subjectValidator,
  classValidator,
  roomValidator,
};
