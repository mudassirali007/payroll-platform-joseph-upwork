<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Employee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $invoices = Invoice::with('employee')->where('user_id', auth()->user()->id)->get();
        return response($invoices, 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
      $validator = Validator::make($request->all(), [
                'employee_id' => ['required', 'integer'],
                'currency' => ['required', 'string', 'max:255'],
                'unit_price' => ['required', 'integer'],
                'payment_address' => ['required', 'string', 'max:255'],
                'payment_currency' => ['required', 'string', 'max:255'],
            ]);

        if($validator->fails()) {
            return response(['status' => false, 'message' => 'fix errors', 'errors' => $validator->errors()], 500);
        }
        $getInvoiceResponse = Http::withHeaders([
                                    'Authorization' => \Config::get('request.key')
                                ])->get(\Config::get('request.url').'/invoices/next-number')->json();
        if(isset($getInvoiceResponse['errors'])) {
            return response(['status' => false, 'message' => 'fix errors', 'errors' => $getInvoiceResponse['errors']], 500);
        }
        $employee = Employee::where([['user_id', auth()->user()->id],['id', $request->employee_id]])->first();
        if(isset($getInvoiceResponse['invoiceNumber']) && isset($employee->id)){
        $response = Http::withHeaders([
                        'Authorization' => \Config::get('request.key')
                    ])->post(\Config::get('request.url').'/invoices', [
                        "meta" => [
                            "format" => "rnf_salary",
                            "version" => "0.0.3"
                        ],
                        "invoiceItems" => [
                            [
                              "currency" => $request->currency,
                              "name" => "Salary",
                              "quantity" => 1,
                              "unitPrice" => $request->unit_price
                            ]
                        ],
                        "invoiceNumber" => Str::uuid(),
                        "sellerInfo" => [
                            "email" => $employee->email,
                            "firstName" => $employee->name
                        ],
                        "paymentAddress" => $request->payment_address,
                        "paymentCurrency" => $request->payment_currency
                    ])->json();
        if(isset($response['errors'])) {
           return response(['status' => false, 'message' => 'fix errors', 'errors' => $response['errors']], 500);
        }

//         dd($response);
        $invoice = new Invoice();
        $invoice->user_id = auth()->user()->id;
        $invoice->employee_id = $employee->id;
        $invoice->currency = $response['invoiceItems'][0]['currency'];
        $invoice->creationDate = $response['creationDate'];
        $invoice->unit_price = $response['invoiceItems'][0]['unitPrice'];
        $invoice->invoice_number = $response['invoiceNumber'];
        $invoice->invoice_id = $response['id'];
        $invoice->payment_address = $response['paymentAddress'];
        $invoice->payment_currency = $response['paymentCurrency'];
        $invoice->data = json_encode($response);
        $invoice->save();
        return response(['status' => true,'success'=>'true','message' => 'Successfully Done.','invoice' => ['id'=>$invoice->id] ], 200);
        } else {
            return response(['status' => false, 'message' => 'Unable to create invoice'], 500);
        }



    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice): Response
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Invoice $invoice): Response
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Invoice $invoice): RedirectResponse
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice): RedirectResponse
    {
        //
    }
}
