<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;


class UserController extends Controller
{


    public function updateUser(Request $request){

     $validator = Validator::make($request->all(), [
                'name' => ['required', 'string', 'max:255'],
            ]);
     if($validator->fails()) {
      return response()->json(['status' => false, 'message' => 'fix errors', 'errors' => $validator->errors()], 500);
      }
//       $user = User::where('id', auth()->user()->id)->update(['name' => $request->name]);
       $user = auth()->user();
       $user->name = $request['name'];
       $user->save();
      return response()->json(['status' => true, 'user' => auth()->user()]);
    }
}
