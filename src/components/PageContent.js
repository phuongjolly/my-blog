import React from "react"
import "./PageContent.css"
import itemdemo1 from "../Resources/images/item-demo1.jpg"
import itemdemo2 from "../Resources/images/item-demo2.jpg"
import itemdemo3 from "../Resources/images/item-demo3.jpg"

class PageContent extends React.Component {
    render () {
        return (
            <div className="page-container">
                <div className="item-box">
                    <div className="photo">
                        <img src={itemdemo1} alt="myBlog"/>
                    </div>

                        <div className="info-header">My Blog</div>
                        <div className="info-detail">About my daily routine and sharing my knowledge with people around me and on the internet</div>

                </div>
                <div className="item-box">
                    <div className="photo">
                        <img src={itemdemo2} alt="my Travelling" />
                    </div>
                    <div className="info-header">Travelling</div>
                    <div className="info-detail">My first project. My main charge is as a font end developer.</div>

                </div>
                <div className="item-box">
                    <div className="photo">
                        <img src={itemdemo3} alt="my Articles"/>
                    </div>
                    <div className="info-header">Travelling</div>
                    <div className="info-detail">My first project. My main charge is as a font end developer.</div>

                </div>
            </div>
        );
    }
}

export default PageContent;
