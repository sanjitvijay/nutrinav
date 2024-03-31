import React from 'react';
import { Link } from 'react-router-dom'; // Add this line to import the Link component
import './welcome.css'; // Make sure this path is correct

function Welcome() {
  return (
    <div>
      <header>
        <div className="logo"></div>
        <div class="hamburger-icon">
            <div class="hamburger-line line-top"></div>
            <div class="hamburger-line line-middle"></div>
            <div class="hamburger-line line-bottom"></div>
        </div>
        <Link to="/sign-up" className="sign-up-button">Sign Up</Link>
      </header>
      <body>
        <div className="title">Get the Most Out of Your Dining Hall Experience</div>
        <div class="subheader">Record your dining hall meals & meet your dietary needs.</div>
        <button className="get-started-button">Get Started</button>
        <button className="learn-more-button">Learn More</button>
        <div className="dining-hall-image"></div>
        <div class="blog">
              <div class="blog-column">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vestibulum, leo eu malesuada ultrices, lorem eros feugiat orci, ut dignissim turpis nisi vitae ante. Fusce ullamcorper sagittis quam, a eleifend metus blandit vel. Duis suscipit efficitur nisi, euismod viverra dui facilisis non. Sed consequat lectus id libero finibus, sed dictum eros ultricies. Donec sit amet aliquet mauris. Proin sed diam eu nisi condimentum bibendum id nec justo. Fusce non ex justo. Nunc nec eros et nisi hendrerit gravida. Nulla facilisi. Integer et eros pretium, convallis odio nec, fermentum orci.</p>
              </div>
              <div class="blog-column">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vestibulum, leo eu malesuada ultrices, lorem eros feugiat orci, ut dignissim turpis nisi vitae ante. Fusce ullamcorper sagittis quam, a eleifend metus blandit vel. Duis suscipit efficitur nisi, euismod viverra dui facilisis non. Sed consequat lectus id libero finibus, sed dictum eros ultricies. Donec sit amet aliquet mauris. Proin sed diam eu nisi condimentum bibendum id nec justo. Fusce non ex justo. Nunc nec eros et nisi hendrerit gravida. Nulla facilisi. Integer et eros pretium, convallis odio nec, fermentum orci.</p>
              </div>
        </div>
      </body>
    </div>
  );
}

export default Welcome;
