import React, { Component } from 'react';

class Footer extends Component {
    render(){
        return (
            <div className="ts narrow containerts center aligned basic small message">
                <p>
                    Copyright © {(new Date()).getFullYear()} <a href="https://retique.allenchou.cc/">Retique</a>.
                    Made by <a href="https://allenchou.cc">Allen Chou</a> with ❤️.
                    Source code released under MIT License.
                </p>
            </div>
        )
    }
}
export default Footer;