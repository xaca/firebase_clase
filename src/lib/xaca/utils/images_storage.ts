import { ref, uploadBytes,getDownloadURL,getStorage } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/lib/xaca/utils/config";
import { UploadImageResponse } from "@/types/upload_image_response";

export function uploadImage(fileInputRef: React.RefObject<HTMLInputElement>, path: string = 'images/users'): Promise<UploadImageResponse> {
    return new Promise((resolve: (value: UploadImageResponse) => void, reject: (reason: UploadImageResponse) => void) => {
        if (!fileInputRef?.current?.files?.length) {
            reject({error: true, message: "No file selected"});
            return;
        }
        
        const app = initializeApp(firebaseConfig);
        const storageRef = ref(getStorage(app), `${path}/${uuidv4()}`);
        const file = fileInputRef?.current?.files?.[0];
        
        uploadBytes(storageRef, file).then((snapshot) => {
            getDownloadURL(snapshot.ref).
            then((downloadURL) => {
                resolve({error:false,data:downloadURL});
            });
        }).catch((error) => {
            reject({error:true,message:error});
        });
    });        
}