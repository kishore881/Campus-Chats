import { useState } from "react";

const handleScroll = (setVisibility)=> {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 128){
        setVisibility(true);
    }else if (scrolled <= 128){
        setVisibility(false);
    }
}

const scrollToTop = () => {
    window.scrollTo({
        top: 0, 
        behavior: 'smooth'
      });
}

export default function ScrollToTop(){
    const [isVisible, setVisibility] = useState(false);
    window.addEventListener('scroll', () => handleScroll(setVisibility));
    
    return(
        <div className="m-4 fixed-bottom d-flex justify-content-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#20c997" className="bi bi-arrow-up-circle-fill rounded-circle shadow-lg" viewBox="0 0 16 16" style={{display:isVisible?'block':'none'}} onClick={scrollToTop}>
                <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"></path>
            </svg>
        </div>
    );
}