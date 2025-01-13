resource "aws_ecs_cluster" "demo_app_ecs_cluster" {
  name = "demo_app_ecs_cluster"
}


resource "aws_ecr_repository" "demo_app_ecr_repository" {
    name = "demo_app_ecr_repository"
    image_tag_mutability = "MUTABLE"
    tags = {
        Name = "demo_app_ecr_repository"
        Environment = "dev"
    }
}


resource "aws_ecs_service" "demo_app_ecs_service" {
  name            = "demo_app_ecs_service"
  cluster         = aws_ecs_cluster.demo_app_ecs_cluster.id
  task_definition = aws_ecs_task_definition.demo_app_ecs_task_definition.arn
  desired_count   = 1  # 単一のタスクを実行
  launch_type     = "EC2"

  network_configuration {
    subnets         = [aws_subnet.demo_app_public_subnet.id]  # パブリックサブネットIDを指定
    security_groups = [aws_security_group.demo_app_sg.id]      # 適切なセキュリティグループIDを指定
    assign_public_ip = true  # パブリックIPを割り当て
  }
}

resource "aws_ecs_task_definition" "demo_app_ecs_task_definition" {
  family                   = "demo_app_ecs_task_definition"
  network_mode             = "awsvpc"
  requires_compatibilities = ["EC2"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([
    {
      name      = "demo_app_container"
      image     = "${aws_ecr_repository.demo_app_ecr_repository.repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
        }
      ]
    }
    ])
}
