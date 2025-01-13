
//AIMロール　AIMのデプロイに必要なIAMロールを作成する
resource "aws_iam_role" "aim_role" {
  name = "aim-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}


resource "aws_iam_instance_profile" "aim_instance_profile" {
  name = "aim-instance-profile"
  role = aws_iam_role.aim_role.name
}

resource "aws_iam_role_policy_attachment" "aim_role_policy_attachment" {
  role = aws_iam_role.aim_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier"
}

