rm index.zip 
cd imageResizer 
zip -r -X ../index.zip *
cd .. 
aws lambda update-function-code --function-name MyLambdaFunction --zip-file fileb://index.zip