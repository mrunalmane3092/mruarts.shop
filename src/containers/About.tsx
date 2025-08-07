
import Header from "../components/Header";
import Footer from "./Footer";
import "./Home.scss";

const About = () => {
    return (


        <>
            <section className="home-section guideline-home-section">
                <Header />
                <div className="info-section guideline-info-section">
                    <div className="container py-5">
                        <h1 className="text-center mb-4  fw-bold">About Me 💜</h1>

                        <div className="">
                            <p>
                                Lately, a lot of people have been asking me who I am and how I started this shop...
                                and that’s when I realized — it’s been a while since I started, but I never introduced myself! 😅
                            </p>

                            <p className="fw-semibold">
                                So here it goes! But first, a big THANK YOU to all of you! 🤗💜 This journey wouldn’t have been
                                possible without your love and support.
                            </p>

                            <p>
                                Hi, I’m Mrunal, but my friends call me Mru, and honestly, I prefer that too! 🥰
                                <br />Fun fact: My nickname is Chingu! 😄
                            </p>

                            <p>
                                Now, here’s the funny part — my family and close friends have always called me Chingu,
                                but I never knew what it meant until 2020. When I found out, I was so happy! 🥺
                                Before that, I wasn’t too fond of it — but now I love it! 💜
                            </p>

                            <p>
                                A little about me: I’ve completed my Master’s in Computers and currently work
                                as a software engineer at an MNC. 👩‍💻
                            </p>

                            <hr />

                            <h3 className="text-secondary fw-bold mt-4 mb-3">💫 How It All Started</h3>

                            <p>
                                I’ve always loved drawing, mainly portraits and doodles. But in 2020, I discovered BTS
                                and started following them closely. At first, I was just watching them — I hadn’t thought of
                                drawing anything related to them.
                            </p>

                            <p>
                                In 2022, I felt this urge to create something meaningful that would help me connect
                                with every BTS moment on a deeper level. That’s when I started drawing BTS art and
                                even got a BTS tattoo that year. 💜
                            </p>

                            <p>
                                Some ARMY friends who saw my art encouraged me to create products. They said people
                                would definitely love them. Back then, my drawings weren’t that great, so I told them
                                I’d improve first and then start making products.
                            </p>

                            <p>
                                After practicing and improving, I finally started making BTS merch — and honestly,
                                I never thought people would love it so much! 🥹💜
                            </p>

                            <p className="mt-4 mb-0 fw-semibold">
                                Thank you from the bottom of my heart for all the love and support. I’ll keep working to
                                improve, and even if the shop slows down someday, I’ll always keep drawing. ✨
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>


    );
};

export default About;
