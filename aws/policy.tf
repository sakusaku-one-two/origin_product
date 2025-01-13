
//IAMロール　Beanstalkのデプロイに必要なIAMロールを作成する
resource "aws_iam_role" "demo_app_role" {
  name = "demo-app-role"
  assume_role_policy = data.aws_iam_policy_document.demo_app_role_policy.json
}

//IAMロールポリシー　Beanstalkのデプロイに必要なIAMロールポリシーを作成する
resource "aws_iam_role_policy" "demo_app_role_policy" {
  name = "demo-app-role-policy"
  role = aws_iam_role.demo_app_role.id
  policy = data.aws_iam_policy_document.demo_app_role_policy.json
}


