<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <link rel="icon" type="image/svg+xml" href="/img/24042614.jpg" />
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Payroll Inc</title>
    <!-- Fonts -->
     <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet"/>

    <style>
        body {
            font-family: 'Nunito', sans-serif;
        }

        .invalid-feedback {
           display: block !important;
        }
    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" integrity="sha512-xh6O/CkQoPOWDdYTDqeRdPCVd1SpvCA9XXcUnZS2FmJNp1coAFzvtCN9BmamE+4aHK8yyUHUSCcJHgXloTyT2A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link href="{{mix('css/app.css')}}" type="text/css" rel="stylesheet" />

</head>
<body class="antialiased">
    <noscript>
      You need to enable JavaScript to  run this app.
    </noscript>
    <div id="app"></div>
    <script src="{{mix('js/app.js')}}" type="text/javascript"></script>
</body>
</html>
