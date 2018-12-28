# Carpe Dalan AWS Lambda Image resizer

This sub-repo contains the package and scripts to deploy to AWS lambda.

It uses the `npm` package `sharp` to take images that are created in any s3 bucket and output them to a `/web` folder within the same bucket with the sizes specified in `../shared/constants/`. 

I've found that the lambda needs at least a GB of memory otherwise lambda will timeout after even 15s, which is pretty unreasonable perfromance-wise.

Also have to setup the lambda to scope the listener to bucket events from a specific bucket's `/original` path so that there's not an endless loop of resizing.