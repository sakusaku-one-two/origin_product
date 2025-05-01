
# //バケット作成　REACTのビルドファイルを保存する
# resource "aws_s3_bucket" "demo_app_bucket" {
#   bucket = "demo-app-bucket"
  
#   tags = {
#     Name = "demo-app-bucket"
#   }
# }

# //バケットポリシー　バケットにアクセスするためのポリシーを設定する
# resource "aws_s3_bucket_policy" "demo_app_bucket_policy" {
#   bucket = aws_s3_bucket.demo_app_bucket.id
#   policy = aws_iam_role_policy.aim_role_policy.policy
# }