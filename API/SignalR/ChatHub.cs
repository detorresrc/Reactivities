using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        private readonly ILogger<ChatHub> _logger;
        public ChatHub(IMediator mediator, ILogger<ChatHub> logger)
        {
      _logger = logger;
            _mediator = mediator;
        }

        public async Task SendComment(Create.Command command)
        {
            var comment = await _mediator.Send(command);

            await Clients.Group(command.ActivityId.ToString())
                .SendAsync("ReceiveComment", comment.Value);
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var activityId = httpContext.Request.Query["activityId"];

            await Groups.AddToGroupAsync(Context.ConnectionId, activityId);
            var result = await _mediator.Send( new List.Query{ActivityId = Guid.Parse(activityId)} );

            await Clients.Caller.SendAsync("LoadComments", result.Value);
        }
    }
}