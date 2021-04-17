# Apna Storage Service
Node based storage service

Prerequisite to run the project
1. ensure that `ffmpeg` installed on machine, if not [ffmpeg download](https://ffmpeg.org/download.html)

### Steps

#### Step 1

Create `.env` on project root dir
specify following properties 
```
PORT = 8000
APP_NAME = APNA_STORAGE_SERVICE
ROOT = <ROOT_FOLDER_FOR_STORE_MEDIA> eg. /Users/username/apna-storage-service/uploads
APP_KEY = <APP_SECRET_KEY>
```

#### Step 2

`yarn` or `npm install`

#### Step 3

`yarn start`


### Example API calls

1. Upload file

```
curl --request POST \
  --url http://localhost:8000/file/upload \
  --header 'Content-Type: multipart/form-data; boundary=---011000010111000001101001' \
  --header 'appKey: appKey' \
  --header 'userId: userId' \
  --form file=@/Users/name/Documents/person.png \
  --form type=image \
  --form thumbnail=@/Users/name/Downloads/person-min.png
```

`type` can be `image` | `video` | `doc`


2. Stream Video

```
curl --request GET \
  --url 'http://localhost:8000/file/stream?path=userId%2Fvideo%2Fsample&quality=144p' \
  --header 'appKey: appKey'
```

path we recieve while upload video

3. Download file

```
curl --request GET \
  --url 'http://localhost:8000/file?path=userId%2Fimage%2Fperson&type=thumbnail' \
  --header 'appKey: appKey'

```

send `type` as `thumbnail` or `main`

