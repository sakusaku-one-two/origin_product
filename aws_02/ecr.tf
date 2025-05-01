

resource "aws_ecr_repository" "db_2" {
  name = "db-2"
}

resource "aws_ecr_repository" "api" {
  name = "api"
}

resource "aws_ecr_repository" "nginx" {
  name = "nginx"
}

