import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import '../styles/components/Auth.scss'
import { auth, db } from './Firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

function Auth() {
    let navigate = useNavigate();
    const [signInEmail, setSignInEmail] = useState("")
    const [signInPassword, setSignInPassword] = useState("")
    const [signInError, setSignInError] = useState("")
    const [signUpEmail, setSignUpEmail] = useState("")
    const [signUpPassword, setSignUpPassword] = useState("")
    const [signUpName, setSignUpName] = useState("")
    const [signUpLastname, setSignUpLastname] = useState("")
    const [signUpError, setSignUpError] = useState("")
    useEffect(() => {
        navigate("/sign-in")
    }, []);
    function signUpWithEmail() {
        if (signUpEmail === "" || signUpPassword === "" || signUpName === "" || signUpLastname === "") {
            setSignUpError("Please, make sure all the fields are filled.");
            return;
        }
        //sign up
        createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword).then(cred => {
            db.collection('Users').doc(cred.user.uid).set({
                Name: signUpName,
                Last_Name: signUpLastname
            }).then(() => {
                setSignUpEmail("");
                setSignUpPassword("");
                setSignUpName("");
                setSignUpLastname("");
            })
        }).catch(err => {
            setSignUpError(err.message);
        })
    }
    function signInWithEmail() {
        if (signInEmail === "" && signInPassword === "") {
            signInWithEmailAndPassword(auth, "guest@bside-music.com", "guest01").then(cred => {
                setSignInEmail("");
                setSignInPassword("");
            }).catch(err => {
                setSignInError(err.message);
            })
        }
        else {
            signInWithEmailAndPassword(auth, signInEmail, signInPassword).then(cred => {
                setSignInEmail("");
                setSignInPassword("");
            }).catch(err => {
                setSignInError(err.message);
            })
        }
    }
    function keySignIn(key) {
        if (key.code === "Enter" || key.code === "NumpadEnter") {
            signInWithEmail();
        }
    }
    function keySignUp(key) {
        if (key.code === "Enter" || key.code === "NumpadEnter") {
            signUpWithEmail();
        }
    }
    return (
        <div id='authentication' className='authentication'>
            <Routes>
                <Route path="/sign-in" element=
                {
                    <div className="authentication__sign-in">
                        <div className="logo">
                            <img src="/ressources/logo.png" alt="Logo"></img>
                        </div>
                        <div className="authentication__sign-in__type">Sign In</div>
                        <p id="sign-in-error" className="authentication__sign-in__error">{signInError}</p>
                        <div className="authentication__sign-in__email">
                            <div className="authentication__sign-in__email__text">E-mail adress :</div>
                            <div className="authentication__sign-in__email__border">
                                <input type="email" size="25" id="sign-in-email" className="authentication__sign-in__email__data" onKeyDown={keySignIn} onChange={e => setSignInEmail(e.target.value)}></input>
                            </div>
                        </div>
                        <div className="authentication__sign-in__password">
                            <div className="authentication__sign-in__password__text">Password :</div>
                            <div className="authentication__sign-in__email__border">
                                <input type="password" size="25" id="sign-in-password" className="authentication__sign-in__password__data" onKeyDown={keySignIn} onChange={e => setSignInPassword(e.target.value)}></input>
                            </div>
                        </div>
                        <button type="button" id="sign-in-button" className="authentication__sign-in__button" onClick={signInWithEmail}>Sign in</button>
                        <Link to='/sign-up' id="goto-sign-up" className="authentication__sign-in__goto-sign-up">Doesn't have an account ? Sign up here</Link>
                    </div>
                } />
                <Route path="sign-up" element=
                {
                    <div className="authentication__sign-up">
                        <div href="" className="logo">
                            <img src="ressources/logo.png" alt="Logo"></img>
                        </div>
                        <div className="authentication__sign-up__type">Sign Up</div>
                        <p id="sign-up-error" className="authentication__sign-up__error">{signUpError}</p>
                        <div className="authentication__sign-up__name">
                            <div className="authentication__sign-up__name__text">Name :</div>
                            <div className="authentication__sign-up__name__border">
                                <input type="text" size="25" id="sign-up-name" className="authentication__sign-up__name__data" onKeyDown={keySignUp} onChange={e => setSignUpName(e.target.value)}></input>
                            </div>
                        </div>
                        <div className="authentication__sign-up__lastname">
                            <div className="authentication__sign-up__lastname__text">Last Name :</div>
                            <div className="authentication__sign-up__lastname__border">
                                <input type="text" size="25" id="sign-up-lastname" className="authentication__sign-up__lastname__data" onKeyDown={keySignUp} onChange={e => setSignUpLastname(e.target.value)}></input>
                            </div>
                        </div>
                        <div className="authentication__sign-up__email">
                            <div className="authentication__sign-up__email__text">E-mail adress :</div>
                            <div className="authentication__sign-up__email__border">
                                <input type="email" size="25" id="sign-up-email" className="authentication__sign-up__email__data" onKeyDown={keySignUp} onChange={e => setSignUpEmail(e.target.value)}></input>
                            </div>
                        </div>
                        <div className="authentication__sign-up__password">
                            <div className="authentication__sign-up__password__text">Password :</div>
                            <div className="authentication__sign-up__email__border">
                                <input type="password" size="25" id="sign-up-password" className="authentication__sign-up__password__data" onKeyDown={keySignUp} onChange={e => setSignUpPassword(e.target.value)}></input>
                            </div>
                        </div>
                        <button type="button" id="sign-up-button" className="authentication__sign-up__button" onClick={signUpWithEmail}>Sign up</button>
                        <Link to='/sign-in' id="goto-sign-in" className="authentication__sign-up__goto-sign-in">Already have an account ? Sign in here</Link>
                    </div>
                } />
            </Routes>
            
        </div>
    )
}

export default Auth