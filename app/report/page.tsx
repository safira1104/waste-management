'use client'

import { useState, useCallback, useEffect } from "react";
import { MapPin, Upload, CheckCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {GoogleGenertiveAI} from '@google/generative-ai';
import {Libraries, StanaloneSearchBox, useJsApiLoader} from '@react-google-maps/api';
import { Libraries } from "@react-google-maps/api";
import { useRouter } from "next/router";
import {toast} from 'react-hot-toast';

const geminiApiKey = process.env.GEMINI_API_KEY;

const Libraries: Libraries = ['places']

export default function ReportPage(){
    const [user, setUser] = useState('');
    const router = useRouter();

    const [reports, setReports] = useState<Array>{
        id:number,
        location:string,
        wasteType:string,
        amount:string,
        createAt:string,
    }>
    >([]);

    const [newReport, setNewReport] = useState({
        location:"",
        type:"",
        amount:"",
    });

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [verificationStatus, setVerificationStatus] = useState<'idle'|'verifying'|'success'|'failure'>('idle');

    const [verificationResult, seterificationResult] = useState<{
        wasteType:string;
        quantity:string;
        confidence: number;
    } | null>(null)

    const [isSubmitt, setIsSubmitt] = useState(false);

    const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);

    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        libraries: Libraries,
    });

    const onLoad = useCallback((ref: google.maps.places.SearchBox)=> {
        setSearchBox(ref);
    }, []);

    const onPlaceChanged = () => {
        if(searchBox){
            const places = searchBox.getPlaces();
            if(places && places.length > 0) {
                const place = places[0];
                setNewReport(prev=> ({
                    ...prev,
                    location: place.formatted_address || "",
                }))
            }
        }
    }
} 