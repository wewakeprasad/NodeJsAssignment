var mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
      },  
  employeeID: {
    type: String,
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  employeeSalary: {
    type: String,
    required: true
  },
  employeeDOJ: {
    type: Date,
    default: Date.now
  }
});

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;
