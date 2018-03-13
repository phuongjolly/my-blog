import React from "react"

class Header extends React.Component {

    render() {
        return (
            <div className="">
                <div className="header-logo">
                    <img
                        src="https://demokaliumsites-laborator.netdna-ssl.com/freelancer/wp-content/uploads/2015/03/dp.png"
                    alt="logo"/>
                </div>
                <div className="menu-column">
                    <i className="align justify icon" />
                </div>

            </div>
        );
    }
}

export default Header;