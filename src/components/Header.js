import React from "react"

class Header extends React.Component {

    render() {
        return (
            <div className="">
                <div className="main-header">
                    <div className="header-logo">
                        <img
                            src="https://demokaliumsites-laborator.netdna-ssl.com/freelancer/wp-content/uploads/2015/03/dp.png"
                            alt="logo"/>
                    </div>
                    <div className="menu-column">
                        <i className="align justify icon" />
                    </div>
                </div>
                <div className="portfolio-container">
                    <div className="portfolio-title-holder">
                        <div className="portfolio-title">Portfolio</div>
                        <div className="portfolio-content">My all projects will be presented here</div>
                    </div>
                    <div className="portfolio-menu">
                        <div className="item">Home</div>
                        <div className="item">Project</div>
                        <div className="item">Articles</div>
                        <div className="item">About</div>
                    </div>
                </div>
            </div>

        );
    }
}

export default Header;