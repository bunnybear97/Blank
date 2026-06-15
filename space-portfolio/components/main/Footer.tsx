import React from "react";
import { RxGithubLogo, RxLinkedinLogo } from "react-icons/rx";
import { FaEnvelope, FaPhone } from "react-icons/fa";

const Footer = () => {
    return (
        <div className="w-full h-full bg-transparent text-gray-200 shadow-lg p-[15px] ">
            <div className="w-full flex flex-col items-center justify-center m-auto">
                <div className="w-full h-full flex flex-row items-center justify-around flex-wrap">
                    <div className="min-w-[200px] h-auto flex flex-col items-center justify-start">
                        <div className="font-bold text-[16px]">Contact</div>
                        <p className="flex flex-row items-center my-[15px] cursor-pointer">
                            <FaEnvelope />
                            <span className="text-[15px] ml-[6px]">
                                subhasreebabu11.b@gmail.com
                            </span>
                        </p>
                        <p className="flex flex-row items-center my-[15px] cursor-pointer">
                            <FaPhone />
                            <span className="text-[15px] ml-[6px]">
                                +44 7717 665409
                            </span>
                        </p>
                    </div>
                    <div className="min-w-[200px] h-auto flex flex-col items-center justify-start">
                        <div className="font-bold text-[16px]">
                            Social
                        </div>
                        <p className="flex flex-row items-center my-[15px] cursor-pointer">
                            <RxGithubLogo />
                            <span className="text-[15px] ml-[6px]">Github</span>
                        </p>
                        <p className="flex flex-row items-center my-[15px] cursor-pointer">
                            <RxLinkedinLogo />
                            <span className="text-[15px] ml-[6px]">
                                LinkedIn
                            </span>
                        </p>
                    </div>
                </div>

                <div className="mb-[20px] text-[15px] text-center">
                    &copy; 2026 Subhasree Babu. All rights reserved
                </div>
            </div>
        </div>
    );
};

export default Footer;
