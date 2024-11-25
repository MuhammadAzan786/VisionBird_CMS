import * as yup from 'yup'

export const taskFormSchema = yup.object({
    taskName:yup.string().min(2).max(25).required('Task name required!'),
    taskPriority:yup.string().required('Select the priority!'),
    taskTime:yup.string().required('Task time required!'),
    workType:yup.string().required('Select work type!'),
    pptCount:yup.string().required('Ppt count required!'),
    slidesCount:yup.string().required('Slides count required!'),
    taskDesc:yup.string().required('Description required!'),
   
})


export const leaveFormSchema  = yup.object({
    employeeName:yup.string().min(2).max(25).required('Employee Name required!'),
    employeeID:yup.string().min(2).max(15).required('Employee ID required!'),
    designation:yup.string().min(2).max(25).required('Designation required!'),
    reasonOfLeave:yup.string().min(2).max(500).required('Reason / Purpose of Leave required!'),
    date: yup.date().required('Date is required').typeError('Invalid date format, must be YYYY-MM-DD'),
    fullLeave:yup.boolean(),
   
})