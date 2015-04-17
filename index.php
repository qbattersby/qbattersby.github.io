<!DOCTYPE html>
<!--[if lt IE 7]><html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]><html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]><html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--><html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Kitchener Waterloo Web Design | Quinn Battersby</title>
        <meta name="description" content="Quinn Battersby is a web designer, creative problem solver and developer living near Waterloo, Ontario, Canada. Click to find out how I can help you improve your business.">
        <meta name="keywords" content="Web Design, Web Development, HTML, CSS, JavaScript, Marketing, Creative Solutions, Design to Development, Design to Code, Kitchener, Waterloo, Cambridge, Guelph">
        <meta name="viewport" content="width=device-width">
        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="css/main.css">
        <script src="js/vendor/modernizr-2.6.2.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.9.0.min.js"><\/script>')</script>
        <script src="js/main.js"></script>
    </head>
    <body class="usingwin">
        <script type="text/javascript">
             mixpanel.track("Hero Page Loaded")
        </script>

        <div class="container">

            <section>
                <h1><span class="blue">Hello, my&nbsp;name&nbsp;is</span> Quinn&nbsp;Battersby</h1>
                <h3>
                    Being passionate about what you do everyday is <strong>important</strong>. I spend
                    my time working at a local College and creating websites and creative
                    solutions for some <span class="blue">amazing people</span>.
                </h3>
                <h2>
                    I can help you improve your business
                </h2>
                <h3>
                    Through good design, meaningful implementation and sound advice.
                </h3>
                <p>
                    Using proven systems I will work with you to create an actionable plan that can be used to
                    meet your business objectives. All services are measured to give you a clear picture on the
                    results of my work. <strong>Would you like to start a conversation about improving your business?</strong>
                </p>
                <a href="mailto:qbattersby@me.com" class="btn moema js-improve-link">Start a Conversation</a>
            </section>

            <section>
                <h2>
                    Looking for rapid answers?
                </h2>
                <h3>
                    The clear and concise answers to your questions.
                </h3>
                <p>
                    <strong>What exactly do you do?</strong><br>
                    I build and design Wordpress websites that are fast, secure and easy to manage. I also provide direction on how businesses can improve their online presence.
                </p>
                <p>
                    <strong>How long will it take?</strong><br>
                    This is hard to estimate as every businesses needs are different. I do offer design to website in
                    2&nbsp;weeks (I’ll take your design and turn it into a Wordpress website), <a href="mailto:qbattersby@me.com" class="js-howlong-link">start&nbsp;a&nbsp;conversation</a> to find&nbsp;out&nbsp;more.
                </p>
                <p>
                    <strong>I wan't it to look good on mobile devices, do you do that?</strong><br>
                    Absolutely, all websites I create unless specified otherwise will automatically adjust and look great on mobile devices.
                </p>
                <p>
                    <strong>How long have you been doing this? Why you?</strong><br>
                    With over 10 years of experience in web design and development with a focus on business success you can rest assured you will receive sound direction.
                </p>
                <p>
                    <strong>Why is your work not on this site?</strong><br>
                   The majority of my work is done under non-disclosure agreements with various agencies. Get in touch with me though and we can chat.
                </p>
                <p>
                    <strong>How much does it cost?</strong><br>
                    Design to website in 2 weeks costs $2000, to find out exactly what this includes <a href="mailto:qbattersby@me.com" class="js-howmuch-link">start&nbsp;a&nbsp;conversation</a>. Other work varies depending on complexity of the project.
                </p>
            </section>

            <section>
                <h2>Some things others are saying</h2>
                <p>
                    Quinn's enthusiasm and insight have led him to be successful in his ventures. I would highly
                    recommend him for either your advertising or marketing initiatives.
                    <div class="testimonial">
                        <span class="author">Daniel Rodrigues</span>
                        (Industry Consultant, Community Engagement Specialist)
                    </div>
                </p>
                <p>
                    He is attentive to detail, extremely responsive, and generally one step ahead of the rest of us when it comes to figuring out our move forward strategies. He is an absolute joy to work with and I cannot recommend him highly enough.
                    <div class="testimonial">
                        <span class="author">Anne Marie Heinrichs</span>
                        (Project Manager at <a href="http://www.howdoitradestocks.com" target="_blank" class="testimonial-link">HowDoITradeStocks.com</a>)
                    </div>
                </p>
                <p>
                    Quinn did a great job implementing the design that I was looking for in my site. I now have an effective tool to communicate with clients, prospects and people looking for general tax and
                    accounting information on the internet. He was also willing and able to work with the limited
                    resources and knowledge I had.
                    <div class="testimonial">
                        <span class="author">Noah Jensen</span>
                        (Partner at <a href="http://srcollp.ca/" target="_blank" class="testimonial-link">Szczepski, Racolta, Jensen & Co. LLP</a>)
                    </div>
                </p>
                <small>Start a conversation and</small><br>
                <a href="mailto:qbattersby@me.com" class="btn moema js-testimonials-link">Add your name above</a>
            </section>

            <section id="form-submitted">
                <h2>I can help you convert your<br> website visitors into customers</h2>
                <?php
                //if "email" variable is filled out, send email
                if (isset($_REQUEST['email']))  {

                    //Email information
                    $admin_email = "qbattersby@me.com";
                    $email = $_REQUEST['email'];
                    $subject = 'Someone wants to Convert Visitors into Customers';
                    $website = $_REQUEST['website'];
                    $fullname = $_REQUEST['fullname'];
                    $goals = $_REQUEST['goals'];
                    $email_body = "<h1>". $fullname ."</h1>";
                    $email_body .= "<strong>Website:</strong> ". $website . "<br>";
                    $email_body .= "<strong>Goals:</strong> ". $goals . "<br>";
                    $headers = "From: " . strip_tags($email) . "\r\n";
                    $headers .= "Reply-To: ". strip_tags($email) . "\r\n";
                    $headers .= "MIME-Version: 1.0\r\n";
                    $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

                    mail($admin_email, "$subject", $email_body, $headers);
                    echo "<p><strong>I will be in touch soon to talk about how we can turn your website visitors into customers</strong></p>";
                }
                else  {
                ?>
                <form action="index.php#form-submitted" method="post" validate>
                    <p>
                        Yes, I’d like to improve my page at <input class="u-field" type="text" name="website" placeholder="www.example.com" required>.
                        My&nbsp;full name is <input class="u-field" type="text" name="fullname" placeholder="Full Name" required>. Please contact me at <input class="u-field" type="email" name="email" placeholder="email@email.com" required> with 3 suggestions that would help
                        us lift <input class="u-field" type="text" name="goals" placeholder="Your Business Goals" required>.
                        <input type="submit" class="btn-sm moema" value="Get Started Now">
                    </p>
                </form>
                <?php
                }
                ?>
            </section>


            <section>
                <h2>
                    Have more specific questions?
                </h2>
                <h3>
                    And some more information about Quinn Battersby
                </h3>
                <p>
                    Find me on <a href="http://www.twitter.com/qbattersby" target="_blank" class="js-twitter-link">twitter</a> if you like. If you prefer traditional, give me a call <a href="tel:226-338-1659">226-338-1659</a>
                    or send me an email at <a href="mailto:qbattersby@me.com" class="js-aboutquinn-link">qbattersby@me.com</a>
                </p>
                <p><strong>My Story:</strong> I'm a web developer, entrepreneur, a husband, a father of two amazing kids, a
                    technologist, a lover of good food and red wine living in Paris, Ontario. <span class="smaller">(it’s small, awesome and close to Waterloo)</span>
                </p>
                <p>I have been working with the web for the past 10 years, I co-founded <a href="http://www.goosechase.com" target="_blank">Goosechase</a>, I help
                    students learn the web and more at <a href="http://www.conestogac.on.ca">Conestoga College</a> and I am always learning new tricks. </p>

            </section>


        </div>

        <script src="js/plugins.js"></script>
        <script>
            var _gaq=[['_setAccount','UA-12843625-1'],['_trackPageview']];
            (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
            g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
            s.parentNode.insertBefore(g,s)}(document,'script'));
        </script>
    </body>
</html>
