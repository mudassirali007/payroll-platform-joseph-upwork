<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $employees = Employee::select('id','name','email','department','job_title')->where('user_id', auth()->user()->id)->get();
        return response($employees, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
      $validator = Validator::make($request->all(), [
                'name' => ['required', 'string', 'max:255'],
                'job_title' => ['nullable', 'string', 'max:255'],
                'department' => ['nullable', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255'],
            ]);

        if($validator->fails()) {
            return response(['status' => false, 'message' => 'fix errors', 'errors' => $validator->errors()], 500);
        }
        $employee = Employee::where([['user_id', auth()->user()->id],['email', $request->email]])->get();
        if(count($employee)){
           return response(['status' => false, 'message' => 'Employee Already Exists'], 500);
        } else {
        $employee = new Employee();
        $employee->user_id = auth()->user()->id;
        $employee->name = $request->name;
        $employee->email = $request->email;
        $employee->job_title = $request->job_title;
        $employee->department = $request->department;
        $employee->save();
        return response(['status' => true,'success'=>'true','message' => 'Successfully Done.','employee' => ['id'=>$employee->id,'name'=>$employee->name,'email'=>$employee->email,'job_title'=>$employee->job_title,'department'=>$employee->department] ], 200);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(Employee $employee): Response
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Employee $employee): Response
    {

          // Validate the request data
             $validatedData = $request->validate([
                 'name' => ['required', 'string', 'max:255'],
                 'job_title' => ['nullable', 'string', 'max:255'],
                 'department' => ['nullable', 'string', 'max:255'],
             ]);


             if(count(Employee::where([['user_id', auth()->user()->id],['id', $employee->id]])->get())){
                 $employee->update($validatedData);
                  // Return a success response
                  return response(['status' => true,'success'=>'true','message' => 'Employee updated successfully.','employee' => ['id'=>$employee->id,'name'=>$employee->name,'email'=>$employee->email,'job_title'=>$employee->job_title,'department'=>$employee->department] ], 200);

             } else {
              return response(['status' => false, 'message' => 'Unable to update the Employee Record'], 500);
             }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employee $employee): Response
    {
    if(count(Employee::where([['user_id', auth()->user()->id],['id', $employee->id]])->get())){
       $employee->delete();
       return response(['status' => true,'success'=>'true','message' => 'Employee record deleted.'], 200);
    } else {
       return response(['status' => false, 'message' => 'Unable to update the Employee Record'], 500);
    }

    }
}
