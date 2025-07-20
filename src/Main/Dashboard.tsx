import React, { useState, useEffect } from 'react';
import { useAuth } from '../Login/AuthContext';
import { DeleteObjectCommand, ListObjectsV2Command, PutObjectCommand } from '@aws-sdk/client-s3';
import { S3BUCKETNAME } from '../setup/aws-config';
import '../index.css'

interface FileItem {
    key: string;
    size:number;
    lastModified: Date;
    url?:string;
}



const Dashboard: React.FC = () => {
    const {user,s3Client, isAuthenticated} = useAuth()
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [files,setFiles] = useState<FileItem[]>([]);
    const [message,setMessage] = useState<string>('');

    const userPrefix = user?.sub ? `private/${user.sub}/` : '';

    const fetchFiles = async ()=>{
        if (!s3Client || !userPrefix) return;

        try{
            const command = new ListObjectsV2Command({
                Bucket:S3BUCKETNAME,
                Prefix: userPrefix
            });

            const response = await s3Client.send(command)
            const fetchedFiles:FileItem[] = (response.Contents || []).filter(obj=> obj.Key !== userPrefix).map(obj => ({
                key:obj.Key || '',
                size: obj.Size || 0,
                lastModified: obj.LastModified || new Date()
            }));

            setFiles(fetchedFiles)
            setMessage('')

        } catch(error: any){
            console.error("Error Fetching files:", error);
            setMessage(`Error fetching files:${error.message}`)
        }
    }

    useEffect(() => {
        if (isAuthenticated && s3Client && user?.sub){
            fetchFiles();
        }
        else{
            setFiles([])
        }
    },[isAuthenticated,s3Client,user?.sub])


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]){
            setSelectedFile(e.target.files[0]);
        }else{
            setSelectedFile(null)
        }
    };

    const handleUpload = async() => {
        if(!selectedFile || !s3Client){
            setMessage('Please select a file to upload.');
            return;
        }
        setUploading(true);
        setMessage('');

        const fileKey = `${userPrefix}${selectedFile.name}`;

        try{
            console.log('UPLOAD LOG ::::::  before creating upload command')
            const command = new PutObjectCommand({
                Bucket:S3BUCKETNAME,
                Key: fileKey,
                Body: selectedFile,
                ContentType: selectedFile.type
            })
            console.log('UPLOAD LOG ::::::  before sending to s3 client')
            await s3Client.send(command)
            console.log('UPLOAD LOG ::::::  after sending to s3 client')
            setMessage('File uploaded successfully!')
            setSelectedFile(null);
            fetchFiles();

        }catch(error: any){
            console.error('Error uploading file:', error);
            setMessage(`Error uploading file: ${error.message}`)
        }finally{
            setUploading(false);
        }
    }

    const handleDownload = async (fileKey: string) => {
        if(!s3Client) return;
        setMessage('');

        console.log('Downloading files not supported right now')
    }
    
    const handleDelete = async (fileKey: string) => {
        if(!s3Client) return;

        setMessage('');
        
        if (!window.confirm(`Are you sure you want to delete ${fileKey.replace(userPrefix,'')} ? `)){
            return;
        }

        try{
            const delCommand = new DeleteObjectCommand({
                Bucket: S3BUCKETNAME,
                Key: fileKey
            });

            await s3Client.send(delCommand);
            setMessage('File deleted successfully!');
            fetchFiles();
        }catch(error: any){
            console.error("Error deleting file:",error);
            setMessage(`Error deleting file:${error.message}`);
        }
    };

    if (!isAuthenticated){
        return <p> Please log in to view your files.</p>
    }


    return (
            <div className="dashboard-container">
      <h2>Welcome, {user?.username || 'User'}!</h2>

      <div className="upload-section">
        <h3>Upload File</h3>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
        {message && <p className="message">{message}</p>}
      </div>

      <div className="file-list-section">
        <h3>Your Files</h3>
        {files.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>File Name</th>
                <th>Size</th>
                <th>Last Modified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.key}>
                  <td>{file.key.replace(userPrefix, '')}</td>
                  <td>{(file.size / 1024).toFixed(2)} KB</td>
                  <td>{new Date(file.lastModified).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleDownload(file.key)}>Download</button>
                    <button onClick={() => handleDelete(file.key)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    )
}

export default Dashboard;